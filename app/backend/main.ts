import { readFileSync } from "fs";
import { createGenericFile } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { generateSigner } from "@metaplex-foundation/umi";
import { signerIdentity } from "@metaplex-foundation/umi";
import { sol } from "@metaplex-foundation/umi";

//  settup

const umi = createUmi("https://api.devnet.solana.com")
  .use(mplCore())
  .use(irysUploader());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

(async () => {
  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the a different rpc other than the free default one supplied.

  await umi.rpc.airdrop(umi.identity.publicKey, sol(5));

  console.log(umi.identity);

  //  file

  const imagePath = "./sleep-1.png";
  const imageFile = readFileSync(imagePath);

  const umiImageFile = createGenericFile(imageFile, imagePath, {
    contentType: "image/png",
  });

  const [image] = await umi.uploader.upload([umiImageFile]);

  const newImageUri = replaceUrl(image, "https://devnet.irys.xyz");

  const uri = await umi.uploader.uploadJson({
    name: "Sleep Token",
    symbol: "SLEEP",
    description: "Get SLEEP with healthy sleep",
    image: newImageUri,
  });

  console.log(uri);
})();

function replaceUrl(url: string, path: string) {
  return path + "/" + url.split("/")[3];
}
