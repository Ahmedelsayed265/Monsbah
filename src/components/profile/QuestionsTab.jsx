import { useRef, useState } from "react";
import AskCard from "../../ui/cards/AskCard";
import AskLoader from "../../ui/loaders/AskLoader";
import ViewAsk from "../../ui/modals/ViewAsk";

import { useSelector } from "react-redux";
import useGetAllAsks from "../../hooks/search/useGetAllAsks";

function QuestionsTab(isActive) {
  const [showModal, setShowModal] = useState(false);
  const [targetAsk, setTargetAsk] = useState({});
  const sectionRef = useRef();

  const user = useSelector((state) => state.clientData.client);

  const { data: asks, isLoading } = useGetAllAsks(isActive);

  return (
    <section className="search_section  w-100 p-0" ref={sectionRef}>
      <div className="row">
        {asks?.data?.data?.data?.map((ask, index) =>
          ask?.user_id === user?.id ? (
            <div className="col-lg-6 col-12 p-1" key={index}>
              <AskCard
                ask={ask}
                setShowModal={setShowModal}
                setTargetAsk={setTargetAsk}
                className="my-ask"
                reverseBg={true}
              />
            </div>
          ) : null
        )}
      </div>

      {isLoading && (
        <>
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div className="col-lg-6 col-12 p-2" key={index}>
                <AskLoader />
              </div>
            ))}
        </>
      )}

      <ViewAsk
        showModal={showModal}
        setShowModal={setShowModal}
        ask={targetAsk}
      />
    </section>
  );
}

export default QuestionsTab;
