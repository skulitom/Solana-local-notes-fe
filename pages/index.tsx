import { Center, Box, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { AppBar } from "../components/AppBar"
import styles from "../styles/Home.module.css";
import React from "react";
import { useGeolocated } from "react-geolocated";

export default function Home() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
  useGeolocated({
      positionOptions: {
          enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Local Notes</title>
        <meta name="description" content="Solana Local Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar />
      <Center>
        <Box>
          <Heading as="h1" size="l" color="black" ml={4} mt={8}>
            Local Notes
          </Heading>
          {isGeolocationAvailable ? (
          <Heading as="h2" size="l" color="black" ml={4} mt={8}>
            Your location is:{coords?.latitude} {coords?.longitude}
          </Heading>) : 
          ( 
          <Heading as="h2" size="l" color="black" ml={4} mt={8}>
            Your location is not available
          </Heading>
          )}
        </Box>
      </Center>
    </div>
  );
}
