import * as borsh from "@project-serum/borsh";
import { PublicKey } from "@solana/web3.js";
import { LOCAL_NOTE_PROGRAM_ID } from "../utils/constants";

export class Note {
  title: string;
  text: string;
  latitude: number;
  longitude: number;
  creator: PublicKey;

  constructor(
    title: string,
    text: string,
    latitude: number,
    longitude: number,
    creator: PublicKey
  ) {
    this.title = title;
    this.text = text;
    this.latitude = latitude;
    this.longitude = longitude;
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

  static mocks: Note[] = [
    new Note(
      "The Dark Knight",
      `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`,
      0,
      0,
      new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
    ),
    new Note(
      "The Dark Knight",
      `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`,
      0,
      0,
      new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
    ),
    new Note(
      "The Dark Knight",
      `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`,
      0,
      0,
      new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
    ),
    new Note(
      "The Dark Knight",
      `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`,
      0,
      0,
      new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
    ),
  ];

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.str("text"),
    borsh.u32("latitude"),
    borsh.u32("longitude"),
  ]);

  static borshAccountSchema = borsh.struct([
    borsh.str("discriminator"),
    borsh.bool("initialized"),
    borsh.publicKey("creator"),
    borsh.str("title"),
    borsh.str("text"),
    borsh.u32("latitude"),
    borsh.u32("longitude"),
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
      const { title, text, latitude, longitude, creator } =
        this.borshAccountSchema.decode(buffer);
      return new Note(title, text, latitude, longitude, creator);
    } catch (e) {
      console.log("Deserialization error:", e);
      console.log(buffer);
      return null;
    }
  }
}
