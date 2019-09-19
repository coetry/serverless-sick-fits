import SingleItem from "../components/SingleItem";
import { useRouter } from "next/router";

const Item = props => {
  const router = useRouter();
  return (
    <div>
      <SingleItem id={router.query.id} />
    </div>
  );
};

export default Item;
