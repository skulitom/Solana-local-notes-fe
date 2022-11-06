import React from "react";
import Head from "next/head";
import GoogleMapReact from "google-map-react";
import { FC } from "react";
import GoogleMapMarker from "./GoogleMapMarker";

const mapCenter = { lat: 38.91131141655464, lng: -77.04375138092037 };

export interface SimpleHoverMapProps {
  center: { lat: number; lng: number };
}

const SimpleHoverMap: FC<SimpleHoverMapProps> = (
  props: SimpleHoverMapProps
) => {
  return (
    <>
      <div>
        <Head>
          <title>Next.js & google-map-react</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div style={{ height: "20vh", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GMAPS_API_KEY as string,
            }}
            defaultCenter={mapCenter}
            defaultZoom={12}
            center={props.center}
          >
            <GoogleMapMarker
              lat={props.center.lat}
              lng={props.center.lng}
              text="Your Location"
            />
          </GoogleMapReact>
          <style jsx global>{`
            body {
              margin: 0;
            }
          `}</style>{" "}
        </div>
      </div>
    </>
  );
};

export default SimpleHoverMap;
