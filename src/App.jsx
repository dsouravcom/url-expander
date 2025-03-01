import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
  const [url, setUrl] = useState("");
  const [fullUrl, setFullUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleShortUrl = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios
      .post(`${import.meta.env.VITE_APP_BACKEND_URL}?url=${url}`)
      .then((res) => {
        if (res.status === 200) {
          setUrl(res.data);
          setFullUrl(true);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error " + error);
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong please try again later!",
        });
      });
  };

  const handleCopyUrl = (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(url)
      .then((e) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Copied successfully",
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to copy text to clipboard. Please try again!",
        });
      });
  };

  const handleRemoveUrl = (e) => {
    e.preventDefault();
    setUrl("");
    setFullUrl(false);
  };

  return (
    <>
      <div
        className={`flex flex-col min-h-screen ${
          isDarkMode ? "text-white bg-gray-800" : "text-black bg-slate-50"
        }`}
      >
        <div className="flex justify-end mr-2">
        <button
          className="p-1 mt-2 bg-slate-300 rounded-md w-fit "
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios/50/sun--v1.png"
              alt="sun--v1"
            />
          ) : (
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/fluency-systems-filled/48/crescent-moon.png"
              alt="crescent-moon"
            />
          )}
        </button>
        </div>
        <h1 className="text-4xl font-semibold text-center mt-40 mb-14">
          Free Link Expander Online
        </h1>
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={fullUrl ? handleCopyUrl : handleShortUrl}
        >
          <input
            type="text"
            placeholder="https://shorturl.com/HIL45"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-4 rounded-md text-black text-xl px-2 py-1 mt-10 w-2/3 disabled:bg-white focus:outline-none focus:border-blue-500"
            required
            disabled={fullUrl}
          />
          {isLoading ? (
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white border rounded-md mt-8"
              disabled
            >
              <svg
                aria-hidden="true"
                className="inline w-6 h-8 mr-3 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              Processing...
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 border-2 rounded-md mt-8"
            >
              {fullUrl ? "COPY" : "SEND"}
            </button>
          )}
        </form>
        {fullUrl ? (
          <button
            className="mt-4 underline text-blue-500"
            onClick={handleRemoveUrl}
          >
            Want to expand another URL
          </button>
        ) : null}
      </div>
    </>
  );
}

export default App;
