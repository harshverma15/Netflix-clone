import Page from '../Pages/page'
import Carousel from 'better-react-carousel'
import React, { useState, useEffect } from "react";
import * as icons from 'react-icons/ai'
import * as icon from 'react-icons/fa'
import gif from './loading.gif';
import net_no_image from './net_no_image.jpg';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

const API_URL = 'https://api.themoviedb.org/3/trending/movie/day?api_key=62ebf6fda469c1af3fe79388b1ce3912'


const getFavoritesFromLocalStorage = () => {
  let favoritesmovie=localStorage.getItem('favoritesMovie');
  if(favoritesmovie){
      favoritesmovie=JSON.parse(localStorage.getItem('favoritesMovie'))
  }
  else{
      favoritesmovie=[]
  }
  return favoritesmovie
}

const getSelectedFromLocalStorage = () => {
  let selectedmovie = localStorage.getItem('selectedMovie');
  if (selectedmovie) {
    selectedmovie = JSON.parse(localStorage.getItem('selectedMovie'))
  }
  else {
    selectedmovie = []
  }

  return selectedmovie
}
function Trendingmovies() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(getSelectedFromLocalStorage())
  const [loading,setLoading] = useState(false)
  const [favoritesmovie, setFavoritesmovie] = useState(getFavoritesFromLocalStorage())
  const navigate = useNavigate();
  let added = 0

  const IMG = 'https://image.tmdb.org/t/p/w500/'

  useEffect(() => {
    setLoading(true);
      fetch(API_URL)
          .then((res) => res.json())
          .then(data => {
              console.log(data)
              setLoading(false)
              setMovies(data.results)
          })
  }, [])

  const selectMovie = (id) => {
    const mov=[];
    let mov1=movies.find((mov) => mov.id === id)
    mov.push(mov1)
    console.log(mov)
    setSelectedMovie(mov)
    localStorage.setItem('selectedMovie', JSON.stringify(mov))
    localStorage.setItem('similar',JSON.stringify(id))
    navigate('/details', { replace:true });
    window.scrollTo(0, 0);     }

  const addToFavorites = (id) =>{
      if (favoritesmovie.length >= 0 && favoritesmovie.length < 15) {
          const meal = movies.find((movie) => movie.id === id);
          const alreadyFavorite = favoritesmovie.find((movie) => movie.id === id);
          if (alreadyFavorite) {
              alert('Already Added')
              return
          }
          const updatedFavorites = [...favoritesmovie, meal]
          setFavoritesmovie(updatedFavorites)
          localStorage.setItem('favoritesMovie',JSON.stringify(updatedFavorites))
          toast.success("Added To My List",{duration: 1500})
      }
      else {
          alert('You Can Only Add 15 Movies/Series To The Favorites')
      }
  }
  const removeFromFavorites = (id) => {
    const updatedFavorites=favoritesmovie.filter((meal) => meal.id != id);     
    localStorage.setItem('favoritesMovie', JSON.stringify(updatedFavorites))
    toast.success("Removed From My List",{duration: 1500})
    setTimeout(redirect,1500)

}
const redirect = () => {
  window.location.reload()
}

  return (
    <>
            <div><Toaster/></div>

      <div className='pop-movie-title' id = "pop-movie-title">
          <h5 className='text-white m-4' style={{ fontFamily: 'Work Sans' }}><br />Trending Now</h5>
          {
          loading?<img src={gif} className="loading"></img>
        
      :(
          <Carousel cols={5} rows={1} mobileBreakpoint={220} responsiveLayout={[
            {
              breakpoint: 800,
              cols: 2,
              rows: 1,
              gap: 10,
              loop: true,
              hideArrow:true
            }
          ]} loop>
              {movies.map((movie) => {
                  const { poster_path, id } = movie
                  let data=net_no_image
                  {poster_path!==null?data=IMG + poster_path:data=data
                    const alreadyFavorite = favoritesmovie.find((movie) => movie.id === id);           
                    if (alreadyFavorite) {
                        added=1
                    }
                  else {
                      added=0
                  }
                  }
                  return <Carousel.Item>
                      
                      <div>

                          <img width="100%" onClick={() => selectMovie(id)} src={data} className='pop-movie' />
                          {added===0?<button type="button" className="button-like btn btn-danger" onClick={() => addToFavorites(id)}><icons.AiOutlinePlus className='iconsize' ></icons.AiOutlinePlus></button>
                :<button type="button" className="button-like btn btn-success" onClick={() => removeFromFavorites(id)}><icon.FaCheck className='iconsize' ></icon.FaCheck></button>
                }    
                          </div>
                          

                  </Carousel.Item>
              })}

              {/* ... */}
          </Carousel>)}
     
      </div>
      </>
  )
}
export default Trendingmovies