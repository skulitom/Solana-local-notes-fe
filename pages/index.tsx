import { Center, Box, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { AppBar } from "../components/AppBar"
import styles from "../styles/Home.module.css";
import React, {useEffect, useState} from "react";
import { NoteList } from "../components/NoteList";
import { Form } from "../components/Form";

export default function Home() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLatitude(position?.coords?.latitude ? position.coords.latitude : 0);
      setLongitude(position?.coords?.longitude ? position.coords.longitude : 0);
    });
  }, [latitude, longitude]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Local Notes</title>
        <meta name="description" content="Solana Local Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar />
      <Center className={styles.AppBody}>
        <Box>
          <Heading  className={styles.HeadingText} as="h1" size="1" color="white" ml={4} mt={8}>
            Local Notes
          </Heading>
          {latitude && longitude ? (
          <Heading as="h2" size="l" color="white" ml={4} mt={8}>
            Your location is 
            <Box color="#AA33AA">
              <div suppressHydrationWarning>
                Lat: {latitude} <br/>
                Long: {longitude}
              </div>
            </Box>
          </Heading>) : 
          ( 
          <Heading as="h2" size="l" color="white" ml={4} mt={8}>
            Your location is not available
          </Heading>
          )}
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
              Add a note
          </Heading>
          <Form latitude={latitude} longitude={longitude} />
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
              Notes around you
          </Heading>
          <NoteList />
        </Box>
      </Center>
    </div>
  );
}
