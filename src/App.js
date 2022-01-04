import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import idl from "./idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { useEffect, useState } from "react";
import kp from "./keypair.json";
// Constants
const { SystemProgram,Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id form the IDL file.
const programID = new PublicKey("4TqU7XzCcwmGZu89sYK2bLzsrLR4P4sAhVhSmgaxbNum");

// Set our network to devent.
const network = clusterApiUrl("devnet");

// Control's how we want to acknowledge when a trasnaction is "done".
const opts = {
  preflightCommitment: "processed",
};

const TWITTER_HANDLE = "anoushk77";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected with Public Key:", response);
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };
  // const sendGif = async () => {
  //   if (inputValue.length === 0) {
  //     console.log("No gif link given!");
  //     return;
  //   }
  //   console.log("Gif link:", inputValue);
  //   try {
  //     const provider = getProvider();
  //     const program = new Program(idl, programID, provider);

  //     await program.rpc.addGif(inputValue, {
  //       accounts: {
  //         baseAccount: baseAccount.publicKey,
  //       },
  //     });
  //     console.log("GIF sucesfully sent to program", inputValue);

  //     // await getGifList();
  //     setGifList([...gifList, inputValue]);
  //   } catch (error) {
  //     console.log("Error sending GIF:", error);
  //   }
  // };
  // const upvote = async (giflink) => {
  //   try {
  //     const provider = getProvider();
  //     const program = new Program(idl, programID, provider);

  //     await program.rpc.voteGif(giflink, {
  //       accounts: {
  //         baseAccount: baseAccount.publicKey,
  //       },
  //     });
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't be initialized.
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }
    // Otherwise, we're good! Account exists. User can submit GIFs.
    else {
      return (
        <div className="connected-container">
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button className="cta-button submit-gif-button"
          onClick={createGifAccount}
          >
            Submit
          </button>
          <div className="gif-grid">
            {/* We use index as the key instead, also, the src is now item.gifLink */}
            {gifList.length > 0
              ? gifList.map((item, index) => (
                  <div className="gif-item" key={index}>
                    {/* {console.log(item)} */}
                    <img
                      src={item.giflink ? item.giflink.toString() : null}
                      alt="giflinkimg"
                    />
                    {/* <div color="white">
                      <p>
                        {item.userAddress ? item.userAddress.toString() : null}
                      </p> */}
                      {/* <button
                        style={{
                          height: "50px",
                          color: "white",
                         // display:"flex",
                          width: "50px",
                        
                        }}
                        onClick={() => {
                          upvote(item.giflink);
                        }}
                        p={1}
                
                        className="cta-button submit-gif-button"
                      >
                      
                        <svg
                        style={{
                          marginLeft:"-20px"
                        }}
                       height="50px"
                        width="50px"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 11l7-7 7 7M5 19l7-7 7 7"
                          />
                        </svg>
                      </button> */}
                    {/* </div> */}
                  </div>
                ))
              : null}
          </div>
        </div>
      );
    }
  };
  useEffect(() => {
    window.addEventListener("load", async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

  // useEffect(() => {
  //   if (walletAddress) {
  //     console.log("Fetching GIF list...");

  //     // Call Solana Program

  //     // Set state
  //     setGifList(async () => {
  //       await getGifList();
  //     });
  //   }
  // }, [walletAddress]);

  // useEffect(() => {
  //   if (walletAddress) {
  //     console.log("Fetching GIF list...");

  //     // Call Solana program here.

  //     // Set state
  //     setGifList(async () => {
  //       await getGifList();
  //     });
  //   }
  // }, [walletAddress]);
  // const getGifList = async () => {
  //   try {
  //     const provider = getProvider();
  //     const program = new Program(idl, programID, provider);
  //     const account = await program.account.baseAccount.fetch(
  //       baseAccount.publicKey
  //     );

  //     console.log("Got the account", account);
  //     setGifList(account.gifList);
  //   } catch (error) {
  //     console.log("Error in getGifs: ", error);
  //     setGifList(null);
  //   }
  // };

  // useEffect(() => {
  //   if (walletAddress) {
  //     console.log("Fetching GIF list...");
  //     getGifList();
  //   }
  // }, [walletAddress]);

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping");
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your Batman GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}

          {walletAddress ? (
            <div>
              <div>
                <p style={{ color: "white" }}>
                  Your wallet address: {walletAddress}
                </p>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {walletAddress && renderConnectedContainer()}
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
