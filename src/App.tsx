import './App.scss';
import Canvas from './components/Canvas';
import MyButton from './components/MyButton';

function App() {

  return (
    <div className="App">
      <div className='container'>
        <Canvas 
          width={700}
          height={500}/>
        <MyButton />
      </div>
    </div>
  );
}

export default App;
