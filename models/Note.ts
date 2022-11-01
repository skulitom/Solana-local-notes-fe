import * as borsh from "@project-serum/borsh";
import { PublicKey } from "@solana/web3.js";
import { LOCAL_NOTE_PROGRAM_ID } from "../utils/constants";

export class Note {
  title: string;
  text: string;
  latitude: number;
  longitude: number;
  aproxLatitude: number;
  aproxLongitude: number;
  creator: PublicKey;

  constructor(
    title: string,
    text: string,
    latitude: number,
    longitude: number,
    creator: PublicKey,
    aproxLatitude: number = 0,
    aproxLongitude: number = 0,
  ) {
    this.title = title;
    this.text = text;
    this.latitude = latitude;
    this.longitude = longitude;
    this.aproxLatitude = aproxLatitude;
    this.aproxLongitude = aproxLongitude;
    this.creator = creator;
  }

  async publicKey(): Promise<PublicKey> {
    return (
      await PublicKey.findProgramAddress(
        [this.creator.toBuffer(), Buffer.from(this.title)],
        new PublicKey(LOCAL_NOTE_PROGRAM_ID)
      )
    )[0];
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.str("text"),
    borsh.i32("latitude"),
    borsh.i32("longitude"),
  ]);

  static borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.publicKey("creator"),
    borsh.i32("latitude"),
    borsh.i32("longitude"),
    borsh.i32("aproxLatitude"),
    borsh.i32("aproxLongitude"),
    borsh.str("discriminator"),
    borsh.str("title"),
    borsh.str("text"),
  ]);

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);
    this.borshInstructionSchema.encode(
      { ...this, variant: 0 },
      buffer
    );
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static deserialize(buffer?: Buffer): Note | null {
    if (!buffer) {
      return null;
    }

    try {
      const { title, text, latitude, longitude, creator, aproxLatitude, aproxLongitude } =
        this.borshAccountSchema.decode(buffer);
        console.log(this.borshAccountSchema.decode(buffer));
      return new Note(title, text, latitude, longitude, creator, aproxLatitude, aproxLongitude);
    } catch (e) {
      console.log("Deserialization error:", e);
      console.log(buffer);
      return null;
    }
  }
}
