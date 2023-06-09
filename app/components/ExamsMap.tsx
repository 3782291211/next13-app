'use client';
import { useState } from "react";
import React from "react";
import BingMapsReact from "../../bing";
import { useWindowWidth } from '@react-hook/window-size/throttled'
import Spinner from "./Spinner";

const ExamsMap = ({isLoading, exams}: ExamsMapProps) => {
  const [mapWidth, setMapWidth] = useState(800);
  
  // Recalculates window width each time it changes (throttled at 30fps)
  const windowWidth = useWindowWidth();
  const mappableExamsAray = exams.map(({latitude, longitude, title, description, candidateId, candidateName, id}) => {
    return {
      center: {
        latitude,
        longitude
      },
      options: {
        title,
        enableHoverStyle: true,
        color: '#e73c7e',
        candidateId,
        description,
        id,
        candidateName
      }
    }
  });

return (
<main>
  {isLoading && <Spinner/>}

  {/* Map */}
  {!isLoading && <div className="flex justify-center m-auto mt-4 lg:w-11/12 max-w-screen-lg">
    <BingMapsReact 
      bingMapsKey={process.env.API_KEY} height={`${windowWidth < 460 ? 400 : windowWidth < 660 ? 500 : mapWidth}px`} width={`${windowWidth < 460 ? 500 : windowWidth < 660 ? 600 : mapWidth}px`}
      mapOptions={{
        navigationBarMode: "square",
      }}
      pushPinsWithInfoboxes={mappableExamsAray}
      viewOptions={{
        center: {  latitude: 27.98785, longitude: 86.925026 },
        mapTypeId: "canvasLight",
        zoom: 1
      }}/>
  </div>}

   {/* Buttons */}
   {!isLoading && windowWidth > 660 &&
  <div className="text-center bg-slate-200 w-56 mx-auto mt-7 rounded-lg">
  <p className="bg-brightPink p-2 rounded-t-md">Change map size</p>
  <div className="flex justify-center">
  <button onClick={() => setMapWidth(mapWidth + 100)} className="m-2">
  <img className="w-7 h-7" src="/images/plus-square-fill.svg"/>
  </button>
  <button onClick={() => setMapWidth(mapWidth - 100)} className="m-2">
  <img className="w-7 h-7" src="/images/dash-square-fill.svg"/>
  </button>
  </div>
  </div>}
</main>);
}

export default ExamsMap;