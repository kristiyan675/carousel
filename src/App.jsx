import Carousel from "./components/Carousel/Carousel";
import Skeleton from "./components/Skeleton/Skeleton";

const App = () => {
  return (
    <div className="App">
      <h1>Our players’ favorite games</h1>
      <Carousel
        fetchUrl="https://picsum.photos/v2/list?page=1&limit=20"
        imageCount={15}
        LoadingComponent={Skeleton}
        containerClassName="custom-container"
        itemClassName="custom-item"
      />
    </div>
  );
};

export default App;
