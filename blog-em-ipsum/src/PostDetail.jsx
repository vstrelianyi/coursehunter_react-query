import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail( { post } ) {

	const deleteMutation = useMutation( (postId)=> deletePost( postId ) )
	const updateMutation = useMutation( (postId)=> updatePost( postId ) )

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={()=> deleteMutation.mutate(post.id)}>Delete</button>
			<button onClick={()=> updateMutation.mutate(post.id)}>Update</button>

			{ deleteMutation.isError && <p style={ { color: "red" } }>Error deleting the post</p> }

			{ deleteMutation.isLoading && (
				<p style={ { color: "purple" } }>Deleting the post</p>
			) }

			{ deleteMutation.isSuccess && (
				<p style={ { color: "green" } }>Post { post.id } has (not) been deleted</p>
			) }

			{ updateMutation.isError && <p style={ { color: "red" } }>Error deleting the post</p> }

			{ updateMutation.isLoading && (
				<p style={ { color: "purple" } }>Updating the post</p>
			) }

			{ updateMutation.isSuccess && (
				<p style={ { color: "green" } }>Post { post.id } has (not) been updated</p>
			) }

			<button onClick={ () => updateMutation.mutate(post.id) }>Update title</button>

      <p>{post.body}</p>
      <h4>Comments</h4>
			<Comments postId={ post.id }/>
    </>
  );
}

const Comments = ( { postId } ) => {
	const { data, isError, isLoading, error } = useQuery(
		["comments", postId ],
		() => fetchComments( postId )
	);

	if( isLoading ) return <h3>Loading...</h3>
	if( isError ) return <><h3>Ooops, something went wrong</h3><p>{ error.toString()}</p></>

	return(
		<ul>
			{data?.map((comment) => (
				<li key={comment.id}>
					{comment.email}: {comment.body}
				</li>
			))}
		</ul>
	)
}
