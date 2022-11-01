import { FC } from "react";
import { Note } from "../models/Note";
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LOCAL_NOTE_PROGRAM_ID, LOCATION_MULTIPLE } from "../utils/constants";

export interface FormProps {
    latitude: number
    longitude: number
}

export const Form: FC<FormProps> = (props: FormProps) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const latitude = Math.floor(props.latitude * LOCATION_MULTIPLE);
    const longitude = Math.floor(props.longitude * LOCATION_MULTIPLE);

    const note = new Note(title, text, latitude, longitude, publicKey);
    handleTransactionSubmit(note);
  };

  const handleTransactionSubmit = async (note: Note) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const buffer = note.serialize();
    const transaction = new web3.Transaction();

    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), Buffer.from(note.title)], // new TextEncoder().encode(movie.title)],
      new web3.PublicKey(LOCAL_NOTE_PROGRAM_ID)
    );

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(LOCAL_NOTE_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      let txid = await sendTransaction(transaction, connection);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e));
      alert(JSON.stringify(e));
    }
  };

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel color="gray.200">Note title</FormLabel>
          <Input
            id="title"
            color="gray.400"
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Add text</FormLabel>
          <Textarea
            id="review"
            color="gray.400"
            onChange={(event) => setText(event.currentTarget.value)}
          />
        </FormControl>
        <Button width="full" color="black" mt={4} type="submit">
          Submit Review
        </Button>
      </form>
    </Box>
  );
};
