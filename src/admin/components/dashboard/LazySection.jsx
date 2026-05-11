import { useInView } from "../../hooks/useInView";

const LazySection = ({ children, fallbackHeight = "400px" }) => {
  const [ref, inView] = useInView();

  return (
    <div ref={ref} style={{ minHeight: inView ? "auto" : fallbackHeight }}>
      {inView ? children : (
        <div
          className="rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse w-full"
          style={{ height: fallbackHeight }}
        />
      )}
    </div>
  );
};

export default LazySection;