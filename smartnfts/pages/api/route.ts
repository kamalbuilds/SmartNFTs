import { Engine } from "@thirdweb-dev/engine";
import { NextResponse } from "next/server";
import prisma from "../../prisma/prisma";

export async function POST(req: Request) {
  // the address to send the nft to
  const { id, address } = await req.json();

  const BACKEND_WALLET_ADDRESS = process.env.BACKEND_WALLET_ADDRESS!;
  const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS!;

  // find the nft using the id in the database
  try {
    const nft = await prisma.nFT.findUnique({
      where: {
        id,
      },
    });

    if (!nft) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 });
    }

    if (nft.minted) {
      return NextResponse.json(
        { error: "NFT already minted" },
        { status: 400 }
      );
    }

    const engine = new Engine({
      url: process.env.ENGINE_URL!,
      accessToken: process.env.THIRDWEB_ACCESS_TOKEN!,
    });

    const tx = await engine.erc721.mintTo(
      "mumbai",
      NFT_CONTRACT_ADDRESS,
      BACKEND_WALLET_ADDRESS,
      {
        metadata: {
          name: nft?.name,
          description: nft?.description,
          image: nft?.image,
        },
        receiver: address,
      }
    );

    await prisma.nFT.update({
      where: {
        id,
      },
      data: {
        owner: address,
        minted: true,
      },
    });

    return NextResponse.json(tx, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}