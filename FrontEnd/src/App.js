
import Meto from "./Meto/Meto";
import Path from "./PathInputPreview/Path";
import Header from "./header/Header";

function App() {
  return (
    <div className="bg-[#27374D] p-3 text-white" >
      <div className="flex flex-row w-[60%] m-auto justify-center">
        <Header />
      </div>
      <div className="App h-[120vh]  flex flex-col justify-start items-center gap-8 pt-20">
        <Meto />
        <Path />
      </div>
    </div>
  );
}

export default App;
