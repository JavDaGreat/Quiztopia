import { useState, useRef, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { AiOutlinePlus } from "react-icons/ai";
import { handleSignUp, handleLogin, handleCreateQuiz } from "./functions";
import mapboxgl, { Map as MapGl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import QuizShow from "./QuizShow";
interface Location {
  longitude: string;
  latitude: string;
}

interface Question {
  question: string;
  answer: string;
  location: Location;
}

interface Quiz {
  questions: Question[];
  username: string;
  quizId: string;
  userId: string;
}

interface ApiResponse {
  success: boolean;
  quizzes: Quiz[];
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiamF2ZGFncmVhdCIsImEiOiJjbGx6ZmYzajAxMG9rM2RzNjh5MmZpeWxuIn0.Yk2H02NbIBK4P1Yl0zFtwA";

function LoginFrom() {
  const [username, setUsername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [addquiz, setAddQuiz] = useState<boolean>(false);
  const [quizName, setQuizName] = useState<string>("");
  const [checkQuizName, setCheckQuizName] = useState<boolean>(true);
  const mapContainer = useRef(null);
  const mapRef = useRef<MapGl | null>(null);
  const [lng, setLng] = useState<number>(10);
  const [lat, setLat] = useState<number>(20);
  let zoom: number = 5;
  const [markerLat, setMarkerLat] = useState<number>(57);
  const [markerLng, setmarkerLng] = useState<number>(12);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [openMyQuiz, setOpenMyQuiz] = useState<boolean>(false);
  const [checkCreateQuestion, setCheckCreateQuestion] = useState<string>("");
  const [Quizes, setQuizes] = useState<Quiz[] | undefined>(undefined);
  const [edit, setEdit] = useState<boolean>(false);
  const CanBeDeleted: boolean = true;
  let Marker = new mapboxgl.Marker();

  async function geoLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const { coords }: any = await geoLocation();
      setLat(coords?.latitude);
      setLng(coords?.longitude);
    };

    fetchData();
  }, []);

  const handleMapShow = async () => {
    if (!mapContainer.current) return;

    mapRef.current = new MapGl({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    const map: MapGl = mapRef.current;
    function add_marker(event: any) {
      var coordinates = event.lngLat;
      setMarkerLat(coordinates.lat);
      setmarkerLng(coordinates.lng);
      console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);

      Marker.setLngLat(coordinates)
        .addTo(map)
        .setPopup(
          new mapboxgl.Popup({ offset: 10 }).setHTML(
            `<h2>${question} </h2><p>${answer}</p>`
          )
        );
    }
    map.on("click", add_marker);
  };

  const handleCreateQuestions = async () => {
    const resp = await fetch(
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: quizName,
          question: question,
          answer: answer,
          location: {
            longitude: markerLng,
            latitude: markerLat,
          },
        }),
      }
    );
    setAnswer("");
    setMarkerLat(12);
    setQuestion("");
    setmarkerLng(57);
    const data: any = await resp.json();
    console.log(data);

    if (data.success) {
      setCheckCreateQuestion("Success");
    } else {
      setCheckCreateQuestion("Error");
    }
  };

  const fetchQuizList = async () => {
    const resp = await fetch(
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz"
    );
    const data: ApiResponse = await resp.json();
    console.log(data);

    setQuizes(data.quizzes);
  };
  const handleShowMyQuiz = async () => {
    setOpenMyQuiz(true);
    await fetchQuizList();
  };
  const content = Quizes?.filter((quiz) => quiz.username === displayName).map(
    (filteredQuiz) => (
      <QuizShow
        name={filteredQuiz.quizId}
        username={filteredQuiz.username}
        questions={filteredQuiz.questions}
        CanBeDeleted={CanBeDeleted}
        token={token}
        fetchQuiz={fetchQuizList}
        setAddQuiz={setAddQuiz}
        setEdit={setEdit}
        setQuizName={setQuizName}
        key={`${filteredQuiz.quizId}-${filteredQuiz.username}`}
      />
    )
  );

  return (
    <div>
      {!displayName ? (
        <button
          className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md"
          onClick={() => setOpen(true)}
        >
          Login
        </button>
      ) : (
        <div className="flex gap-12">
          <button
            className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md"
            onClick={() => window.location.reload()}
          >
            Sign out
          </button>
          <button
            onClick={() => setAddQuiz(true)}
            className="flex gap-2 m-1  justify-center items-center bg-slate-600 hover:bg-gray-950 text-white p-2  rounded-md"
          >
            <AiOutlinePlus /> <p>Add new Quiz</p>
          </button>
          <button
            onClick={handleShowMyQuiz}
            className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md"
          >
            My quiz
          </button>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false), setMessage("");
        }}
        center
        focusTrapped={false}
      >
        <div className=" rounded-md ">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow  border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight "
                id="password"
                type="password"
                placeholder="***********"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
              />
              <p className="text-red-500 text-xs italic">{message}</p>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  handleLogin(
                    username,
                    password,
                    setOpen,
                    setMessage,
                    setToken,
                    setDisplayName
                  )
                }
                className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded "
                type="button"
              >
                Sign In
              </button>
              <button
                onClick={() =>
                  handleSignUp(username, password, setOpen, setMessage)
                }
                className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded "
                type="button"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        open={addquiz}
        onClose={() => {
          setAddQuiz(false), setCheckQuizName(false), setEdit(false);
        }}
        classNames={{
          modal: "customModal",
        }}
        center
      >
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {!edit ? (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="QuizName"
                >
                  Quiz Name
                </label>
                <input
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                  id="QuizName"
                  type="text"
                  placeholder="My quiz"
                  onChange={(e) => setQuizName(e.target.value)}
                />
                {!checkQuizName ? (
                  <p className="text-green-500 text-xs italic m-1">
                    {" "}
                    Quiz name Avalible
                  </p>
                ) : undefined}

                <button
                  onClick={() =>
                    handleCreateQuiz(token, quizName, setCheckQuizName)
                  }
                  className="bg-gray-700 hover:bg-gray-950  text-white font-bold py-2 px-4 rounded  m-2"
                  type="button"
                >
                  Check Avialiblity
                </button>
              </div>
            ) : undefined}

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-1"
                htmlFor="Question"
              >
                Question
              </label>
              <input
                value={question}
                disabled={checkQuizName}
                onChange={(e) => setQuestion(e.target.value)}
                className="shadow border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight "
                id="Question"
                type="text"
                placeholder="Here is the oldest church."
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Answer"
              >
                Answer
              </label>
              <input
                value={answer}
                disabled={checkQuizName}
                onChange={(e) => setAnswer(e.target.value)}
                className="shadow border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight "
                id="Answer"
                type="text"
                placeholder="Domkycrcka"
              />
            </div>

            <p>Click to pin a location</p>

            <button
              onClick={handleMapShow}
              className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded  m-2"
              type="button"
              disabled={checkQuizName}
            >
              Show Map{" "}
            </button>

            <div ref={mapContainer} className="map-container" />
          </form>
          <button
            onClick={handleCreateQuestions}
            className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded  m-2"
            type="button"
            disabled={checkQuizName}
          >
            Submit
          </button>
          <p className="text-green-500 italic text-md">{checkCreateQuestion}</p>
        </div>
      </Modal>

      <Modal open={openMyQuiz} onClose={() => setOpenMyQuiz(false)} center>
        {content}
      </Modal>
    </div>
  );
}

export default LoginFrom;
