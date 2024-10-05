import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const Comments = ({ postId }) => {
  const queryClient = useQueryClient();
  const { data: comments, isLoading, error } = useQuery(['comments', postId], () =>
    axios.get(`/api/posts/${postId}/comments`).then(res => res.data)
  );

  const mutation = useMutation(
    newComment => axios.post(`/api/posts/${postId}/comments`, newComment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
    }
  );

  const [content, setContent] = useState('');
  const [parentId, setParentId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ content, parent: parentId });
    setContent('');
    setParentId(null);
  };

  if (isLoading) return <div>댓글 로딩 중...</div>;
  if (error) return <div>댓글을 불러오는 데 실패했습니다.</div>;

  return (
    <div>
      <h2>댓글</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 작성하세요"
          required
        />
        <button type="submit">댓글 추가</button>
      </form>
      <ul>
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </ul>
    </div>
  );
};

const CommentItem = ({ comment, postId }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    newReply => axios.post(`/api/posts/${postId}/comments`, newReply),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
    }
  );

  const handleReplySubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ content: replyContent, parent: comment.id });
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <li>
      <p>{comment.content}</p>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>답글 달기</button>
      {showReplyForm && (
        <form onSubmit={handleReplySubmit}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 작성하세요"
            required
          />
          <button type="submit">답글 추가</button>
        </form>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul>
          {comment.replies.map(reply => (
            <li key={reply.id}>
              <p>{reply.content}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Comments;
