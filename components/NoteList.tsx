import { NoteCard } from "./NoteCard";
import { FC, useEffect, useMemo, useState } from "react";
import { Note } from "../models/Note";
import { NoteCoordinator } from "../coordinators/NoteCoordinator";
import {
  Button,
  Center,
  HStack,
  Input,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";

export const NoteList: FC = () => {
  const { connection } = useConnection();
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNote, setSelectedNote] = useState<Note>(Note.mocks[0]);

  useEffect(() => {
    NoteCoordinator.fetchPage(connection, page, 5, search, search !== "").then(
      setNotes
    );
  }, [page, search]);

  const handleReviewSelected = (note: Note) => {
    setSelectedNote(note);
    onOpen();
  };

  return (
    <div>
      <Center>
        <Input
          id="search"
          color="gray.400"
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search"
          w="97%"
          mt={2}
          mb={2}
        />
      </Center>
      {notes.map((note, i) => (
        <NoteCard
          key={i}
          note={note}
          onClick={() => {
            handleReviewSelected(note);
          }}
        />
      ))}
      <Center>
        <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)}>Previous</Button>
          )}
          <Spacer />
          {NoteCoordinator.accounts.length > page * 5 && (
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          )}
        </HStack>
      </Center>
    </div>
  );
};
