import bs58 from "bs58";
import BN from 'bn.js';
import * as web3 from "@solana/web3.js";
import { Note } from "../models/Note";
import { LOCAL_NOTE_PROGRAM_ID, LOCATION_MULTIPLE_APROX, LOCATION_MULTIPLE_APROX_COEFF } from "../utils/constants";

export class NoteCoordinator {
  static accounts: web3.PublicKey[] = [];

  static async prefetchAccounts(connection: web3.Connection, latitude: number, longitude: number) {
    //isInitialized + address + lat + lon
    const offset = 
      1 + 
      32 + 
      4 + 
      4
    //aproxLat + aproxLon + (len bytes + descriminator)
    const len = 
      4 + 
      4 + 
      4 + 7
    
    const aproxLatitude = Math.round(latitude * LOCATION_MULTIPLE_APROX) * LOCATION_MULTIPLE_APROX_COEFF;
    const aproxLongitude = Math.round(longitude * LOCATION_MULTIPLE_APROX) * LOCATION_MULTIPLE_APROX_COEFF;
    console.log("Expect", aproxLatitude, aproxLongitude, "Src", latitude, longitude)

    //console.log("bytes", toBytesInt32(aproxLatitude));

    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(LOCAL_NOTE_PROGRAM_ID), 
      {
        dataSlice: { offset: offset, length: offset + len + 10 },
        filters: [
          {
            memcmp:
              {
                offset: offset + 8 + 4,
                bytes: bs58.encode(Buffer.from("notev2"))
              }
          },
          {
            memcmp:
            {
              offset: offset,
              bytes: bs58.encode((new BN(aproxLatitude, 'le')).toArray())
            }
          },
          {
            memcmp:
            {
              offset: offset + 4,
              bytes: bs58.encode((new BN(aproxLongitude, 'le')).toArray())
            }
          }
        ]
      }
    );

    this.accounts = accounts.map((account) => account.pubkey);
  }

  static async fetchPage(
    connection: web3.Connection,
    page: number,
    perPage: number,
    latitude: number,
    longitude: number,
    reload: boolean = false
  ): Promise<Note[]> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, latitude, longitude);
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
      console.log(note.aproxLatitude, note.aproxLongitude)
      return [...accum, note];
    }, []);

    return notes;
  }
}
