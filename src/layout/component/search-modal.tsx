import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CinemaInput from "../../component/cinema-input";
import WhiteSearchIcon from "../../assets/icon/White Search.png";
import { useQuery } from "react-query";
import { getTopMovieList } from "../../api/api";
import { flexCenter } from "../../style/common.style";
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../../const/query-key";
import { MovieListResponse, PartialMovie, searchModalProps } from "../../type/movie-type";
import { URL } from "../../const/url";

const SearchModal = ({ setIsSearchOpen }: searchModalProps) => {
  const { data: movieList } = useQuery<MovieListResponse>([QUERY_KEY.TopFiveMovieList], getTopMovieList);
  const [hoveredMovie, setHoveredMovie] = useState<PartialMovie | null>(null);
  const navigate = useNavigate();

  const topFiveMovies = movieList?.results?.slice(0, 5) || [];

  useEffect(() => {
    if (topFiveMovies.length > 0 && !hoveredMovie) {
      setHoveredMovie(topFiveMovies[0]);
    }
  }, [topFiveMovies, hoveredMovie]);

  const onSearchMovie = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let keyword = (e.target as HTMLInputElement).value;
      navigate(`/movie/search?keyword=${keyword}`);
      window.scrollTo(0, 0);
      setIsSearchOpen(false);
    }
  };

  return (
    <Container>
      <TopFiveMovieBox>
        <MoviePoster>{hoveredMovie && <img src={`${URL.posterURL + hoveredMovie.poster_path}`} alt={hoveredMovie.title} />}</MoviePoster>
        <MoviesList>
          {topFiveMovies.map((movie: PartialMovie, index: number) => (
            <MovieItem key={movie.id} onMouseEnter={() => setHoveredMovie(movie)} onMouseLeave={() => setHoveredMovie(topFiveMovies[0])}>
              <p>
                <MovieNumber>{index + 1}</MovieNumber>
                <MovieTitle
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate(`/detail/${movie.id}`);
                  }}
                >
                  {movie.title}
                </MovieTitle>
              </p>
            </MovieItem>
          ))}
        </MoviesList>
      </TopFiveMovieBox>
      <SearchBox>
        <CinemaInput variant="white" size="large" shape="default" onKeyPress={onSearchMovie} />
        <WhiteSearchImg src={WhiteSearchIcon} />
      </SearchBox>
    </Container>
  );
};

export default SearchModal;

const slideDown = keyframes`
  from {
    top: -300px; 
  }
  to {
    top: 141px; 
  }
`;

const Container = styled.div`
  width: 100%;
  height: 380px;
  background-color: ${({ theme }) => theme.COLORS.primary["purple"]};
  position: fixed;
  top: 141px;
  animation: ${slideDown} 0.75s ease-out;
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 20px;
  @media ${({ theme }) => theme.DEVICE.mobile} {
    height: 150px;
  }
`;

const TopFiveMovieBox = styled.div`
  ${flexCenter}
  padding-left: 170px;
  @media ${({ theme }) => theme.DEVICE.mobile} {
    display: none;
  }
`;

const MoviePoster = styled.div`
  margin-right: 20px;

  img {
    width: 150px;
    height: 214px;
    transition: opacity 0.3s ease-in-out;
  }
`;

const MoviesList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MovieItem = styled.div`
  width: 350px;
  margin: 13px 0;
  font-size: ${({ theme }) => theme.FONT_SIZE.medium};
  text-align: left;
  color: white;
  cursor: pointer;
`;

const MovieNumber = styled.span`
  font-size: 22px;
  margin-right: 15px;
`;

const MovieTitle = styled.span`
  &:hover {
    text-decoration: underline;
  }
`;

const SearchBox = styled.div`
  padding-right: 300px;
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const WhiteSearchImg = styled.img`
  position: absolute;
  right: 305px;
  top: 22px;
  width: 25px;
  margin-left: 10px;
`;
