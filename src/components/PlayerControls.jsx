import React from "react";
import styled from "styled-components";
import {
    BsFillPlayCircleFill,
    BsFillPauseCircleFill,
    BsShuffle,
  } from "react-icons/bs";
  import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
  import { FiRepeat } from "react-icons/fi";
  import { useStateProvider } from "../utils/StateProvider";
  import axios from "axios";
  import { reducerCases } from "../utils/Constants";
export default function PlayerControls(){
    const [{ token, playerState }, dispatch] = useStateProvider();


    const changeState=async()=>{
      const state=playerState ? "pause":"play";
      const response=await axios.put(
          `https://api.spotify.com/v1/me/player/${state}`,
          {},
          {
           headers:{
          Authorization: "Bearer " + token,
          "Content-Type":"application/json",
        } ,
      });
      dispatch({ 
        type: reducerCases.SET_PLAYER_STATE,
         playerState:!playerState 
      });
   };
     const changeTrack=async(type)=>{
        await axios.post(
            `https://api.spotify.com/v1/me/player/${type}`,
            {},
            {
             headers:{
            Authorization: "Bearer " + token,
            "Content-Type":"application/json",
          } ,
        });
       
        const response=await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing ",{
             headers:{
            Authorization: "Bearer " + token,
            "Content-Type":"application/json",
          } ,
        });
    


        if (response.data !== "") {
            const currentPlaying = {
              id: response.data.item.id,
              name: response.data.item.name,
              artists: response.data.item.artists.map((artist) => artist.name),
              image: response.data.item.album.images[2].url,
            };
            dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
        } else {
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
        }
     };
    
    
    return (
        <Container>
        <div className="shuffle">
          <BsShuffle />
        </div>
        <div className="previous">
          <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
        </div>
        <div className="state">
          {playerState ? (
            <BsFillPauseCircleFill onClick={changeState} />
          ) : (
            <BsFillPlayCircleFill onClick={changeState} />
          )}
        </div>
        <div className="next">
          <CgPlayTrackNext onClick={() => changeTrack("next")} />
        </div>
        <div className="repeat">
          <FiRepeat />
        </div>
      </Container>
    );
    
}
const Container=styled.div`
 display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
`;