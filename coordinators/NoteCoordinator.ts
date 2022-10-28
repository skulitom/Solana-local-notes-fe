import bs58 from "bs58";
import * as web3 from "@solana/web3.js";
import { Note } from "../models/Note";
import { LOCAL_NOTE_PROGRAM_ID } from "../utils/constants";

export class NoteCoordinator {
  static accounts: web3.PublicKey[] = [];

  static async prefetchAccounts(connection: web3.Connection, search: string) {
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(LOCAL_NOTE_PROGRAM_ID)
    );

    this.accounts = accounts.map((account) => account.pubkey);
  }

  static async fetchPage(
    connection: web3.Connection,
    page: number,
    perPage: number,
    search: string,
    reload: boolean = false
  ): Promise<Note[]> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, search);
    }

    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * perPage,
      page * perPage
    );

    if (paginatedPublicKeys.length === 0) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      paginatedPublicKeys
    );

    const notes = accounts.reduce((accum: Note[], account) => {
      const note = Note.deserialize(account?.data);
      if (!note) {
        return accum;
      }

      return [...accum, note];
    }, []);

    return notes;
  }
}
