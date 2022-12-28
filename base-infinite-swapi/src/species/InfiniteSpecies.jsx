import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from 'react-query';

import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
	const data = await response.json();
	console.log( data );

  return data;
};

export function InfiniteSpecies() {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery(
		'sw-species',
		( { pageParam = initialUrl } ) => fetchUrl(pageParam),
		{
			getNextPageParam: ( lastPage, ) => lastPage.next || undefined
		}
	);

	if( isLoading ) return <div className="loading">Loading...</div>
	if( isError ) return <div className="loading">Error! { error.toString() }</div>

  return (
		<>
			{ isFetching && <div className="loading">Loading...</div> }
			<InfiniteScroll loadMore={ fetchNextPage } hasMore={ hasNextPage }>
				{ data.pages.map( pageData => {
					return pageData.results.map( person => <Species key={ person.name } name={ person.name } language={ person.language } averageLifespan={ person.average_lifespan } />)
				} ) }
			</InfiniteScroll>
		</>
	);
}
