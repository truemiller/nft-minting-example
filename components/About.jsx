export const About = () => (
  <section
    className="flex p-5 py-40  bg-opacity-50 text-white shadow-xl"
    id="about"
  >
    <div className="container mx-auto flex flex-row justify-between">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="">
          <h2>About</h2>
          <p>This is a basic NFT minting example project.</p>
          <p>It is intentionally simple and meant for learning.</p>
          <p>
            Use it as a starting point, then replace contract logic, metadata,
            and UI for your own project.
          </p>
        </div>
      </div>
    </div>
  </section>
);
