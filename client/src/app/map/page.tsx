import Map from '../components/map';
import useGeoLocation from "./useGeo";

export default function Page() {
  const [isSelectedLocation, setSelected] = useState(false);
  const [location, setLocation] = useState(center);
  const userLocation = useGeoLocation();

    return(
    <>
    <h1>Map Page</h1>
    <Map
        center={userLocation.loaded ? location : center}/>
    </> )
  }
  