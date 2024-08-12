import BounceLoader from "react-spinners/BounceLoader";

export default function Loader() {
    return (
        <div className="mx-auto flex my-5">
            <BounceLoader size="50px" color="#292524" cssOverride={{ margin: 'auto', marginTop: '8px', marginBottom: '8px' }} />
        </div>
    );
}