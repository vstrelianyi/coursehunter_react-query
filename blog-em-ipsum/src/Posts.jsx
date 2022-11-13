import { useState, useEffect } from "react";

import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts( pageNum ) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${ pageNum }`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

	const queryClient = useQueryClient();

  const { data, isError, isLoading, error } = useQuery(
		["posts", currentPage],
		()=>fetchPosts( currentPage ),
		{
			staleTime: 2000,
		}
	);

	useEffect( ()=>{
		if( currentPage < maxPostPage ) {
			const nextPage = currentPage + 1;
			queryClient.prefetchQuery(
				["posts", nextPage ],
				()=> fetchPosts( nextPage ),
				{
					staleTime: 2000,
					keepPreviousData: true
				}
			)
		}
	}, [currentPage, queryClient])

	if( isLoading ) return <h3>Loading...</h3>
	if( isError ) return <><h3>Ooops, something went wrong</h3><p>{ error.toString()}</p></>
  return (
    <>
      { data?.length ?
				(
					<ul>
						{data?.map((post) => (
							<li
								key={post.id}
								className="post-title"
								onClick={() => setSelectedPost(post)}
							>
								{post.title}
							</li>
						))}
					</ul>
				):
				null
			}

      <div className="pages">
        <button
					disabled={ currentPage <=1 }
					onClick={() => { setCurrentPage( prevState => prevState - 1)}}
				>
          Previous page
        </button>

        <span>Page {currentPage}</span>

        <button
					disabled={ currentPage >= maxPostPage }
					onClick={() => { setCurrentPage( prevState => prevState + 1)}}
				>
          Next page
        </button>

      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
