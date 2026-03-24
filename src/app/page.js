import Image from "next/image";
import Header from "./components/header";
import MovieApp from "./components/body";

export default function Home() {
  return (
    <div className="bg-black">
   {/* <Header/> */}
   <MovieApp/>
    </div>
  );
}
