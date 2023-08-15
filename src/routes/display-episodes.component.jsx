import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Notes from "../components/notes.component";
import Heart from "../components/heart";
import {toggleEpFav, deleteTagFromEpisode,} from "../firebase/firebase";
import {db} from "../firebase/firebase";


const DisplayEpisodes = (userUid) => {
  const location = useLocation();
  const show = location.state?.show || null;
  const seasonNumber = location.state?.seasonNumber || null;

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const apiKey = "1b2efb1dfa6123bdd9569b0959c0da25";
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${show.id}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();

        if (data.episodes) {
          setEpisodes(
            data.episodes.map((episode) => ({
              ...episode,
              isHeartClicked:
                JSON.parse(
                  localStorage.getItem(
                    `isHeartClicked_${show.id}_${seasonNumber}_${episode.id}`
                  )
                ) || false,
              tags:
                JSON.parse(
                  localStorage.getItem(
                    `tags_${show.id}_${seasonNumber}_${episode.id}`
                  )
                ) || [],
              notes:
                JSON.parse(
                  localStorage.getItem(
                    `notes_${show.id}_${seasonNumber}_${episode.id}`
                  )
                ) || [],
            }))
          );
          setLoading(false);
        } else {
          setError("Episodes data not found.");
          setLoading(false);
        }
      } catch (error) {
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    if (show) {
      fetchEpisodes();
    } else {
      setLoading(false);
    }
  }, [show, seasonNumber]);

  const handleTagsChange = (episodeId, newTags) => {
    setEpisodes((prevEpisodes) =>
      prevEpisodes.map((episode) =>
        episode.id === episodeId ? { ...episode, tags: newTags } : episode
      )
    );
    localStorage.setItem(
      `tags_${show.id}_${seasonNumber}_${episodeId}`,
      JSON.stringify(newTags)
    );
  };

  const handleTagDelete = (episodeId, tagToDelete) => {
    setEpisodes((prevEpisodes) =>
      prevEpisodes.map((episode) =>
        episode.id === episodeId
          ? { ...episode, tags: episode.tags.filter((tag) => tag !== tagToDelete) }
          : episode
      )
    );
    deleteTagFromEpisode(episodeId, tagToDelete);

    const updatedTags = episodes.find((episode) => episode.id === episodeId)?.tags || [];
    localStorage.setItem(`tags_${show.id}_${seasonNumber}_${episodeId}`, JSON.stringify(updatedTags));
  };

  const handleNotesChange = (episodeId, newNotes) => {
    setEpisodes((prevEpisodes) =>
      prevEpisodes.map((episode) =>
        episode.id === episodeId ? { ...episode, notes: newNotes } : episode
      )
    );
    localStorage.setItem(
      `notes_${show.id}_${seasonNumber}_${episodeId}`,
      JSON.stringify(newNotes)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleHeartClick = (episodeId) => {
    setEpisodes((prevEpisodes) =>
      prevEpisodes.map((episode) => {
        if (episode.id === episodeId) {
          const newHeartState = !episode.isHeartClicked;
          localStorage.setItem(
            `isHeartClicked_${show.id}_${seasonNumber}_${episodeId}`,
            JSON.stringify(newHeartState)
          );
          toggleEpFav(
            show.id,
            seasonNumber,
            episode.id,
            episode.name,
            episode.episode_number,
            newHeartState
          );
          return { ...episode, isHeartClicked: newHeartState };
        }
        return episode;
      })
    );
  };
  

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-5xl text-center p-5 h-28">
        Season {seasonNumber}
      </h1>
      <div />
      {episodes.map((episode) => (
        <div
          className="collapse collapse-plus bg-base-200 w-9/12 "
          key={episode.id}
        >
           <input type="checkbox" name="my-accordion-3 flex flex-row items-center" />
          <div className="collapse-title text-xl"> 
            <figure className="float-left">
            {episode.still_path ? (
              <img className = "rounded-lg"
                src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                alt={`Episode ${episode.episode_number} - ${episode.name}`}
                style={{ width: "300px", height: "auto" }}
              />
              ) : (
                <div style={{ width: "300px", height: "175px" }} className="flex justify-center items-center w-full h-96 bg-base-100 rounded text-2xl text-base-content text-center">
                  No Poster Image Currently Found
                </div>
              )}
            </figure>
            <div className="card-body select-text">
              <h2 className="font-bold text-2xl">
                Episode {episode.episode_number}: {episode.name}
              </h2>
              <h1 className="italic">
                {episode.vote_average}/10 - {episode.runtime} minutes
              </h1>
              <h1 className="italic">Aired: {episode.air_date} </h1>
              <p>{episode.overview}</p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
          <div className="collapse-content">
            <Heart
              showId =  {show.id}
              seasonNumber = {seasonNumber} 
              episodeId={episode.id}
              episodeNumber= {episode.episode_number}
              isHeartClicked={episode.isHeartClicked}
              handleHeartClick={handleHeartClick}
            />
            <div className="divider" />
            <Notes
              episodeData={episode}
              onTagsChange={(newTags) => handleTagsChange(episode.id, newTags)}
              onNotesChange={(newNotes) =>
                handleNotesChange(episode.id, newNotes)}
                onTagDelete={(episodeId, tagToDelete) => handleTagDelete(episodeId, tagToDelete)} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayEpisodes;


  //IGNORE THIS, WORKING ON GETTING DATA TO FETCH FROM FIREBASE, NOT LOCALSTORAGE
  // useEffect(() => {
  //   const fetchEpisodes = async () => {
  //     try {
  //       const apiKey = "1b2efb1dfa6123bdd9569b0959c0da25";
  //       const response = await fetch(
  //         `https://api.themoviedb.org/3/tv/${show.id}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`
  //       );
  //       const data = await response.json();
  
  //       if (data.tv_shows) {
  //         const episodesWithExtras = await Promise.all(
  //           data.tv_shows.map(async (episode) => {
  //             const episodeRef = db
  //               .collection(`shows/${show.id}/seasons/${seasonNumber}/episodes`)
  //               .doc(episode.id.toString());
  
  //             const episodeExtras = await episodeRef.get();
  
  //             return {
  //               ...episode,
  //               isHeartClicked: episodeExtras.data()?.isHeartClicked || false,
  //               tags: episodeExtras.data()?.episode_tags || [],
  //               notes: episodeExtras.data()?.episode_notes || [],
  //             };
  //           })
  //         );
  
  //         setEpisodes(episodesWithExtras);
  //         setLoading(false);
  //       } else {
  //         setError("Episodes data not found.");
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       setError("Error fetching data.");
  //       setLoading(false);
  //     }
  //   };
  
  //   if (show) {
  //     fetchEpisodes();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [show, seasonNumber]);
  
  
  // const handleTagsChange = (episodeId, newTags) => {
  //   const episodeRef = db
  //     .collection(`shows/${show.id}/seasons/${seasonNumber}/episodes`)
  //     .doc(episodeId.toString());
  
  //   episodeRef.update({
  //     tags: newTags,
  //   });
  
  //   setEpisodes((prevEpisodes) =>
  //     prevEpisodes.map((episode) =>
  //       episode.id === episodeId ? { ...episode, tags: newTags } : episode
  //     )
  //   );
  // };
  
