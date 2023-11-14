import topSweeters from "../constants";

const RightSidebar = () => {
    return (
        <section className="bg-dark_soul h-screen w-[360px] border-r-2 border-slate-900">
            <div className="px-6 py-4">
                <h3 className="px-6 text-pure_soul font-medium uppercase text-lg">
                    Suggested
                </h3>
                <div className="p-6">
                    {topSweeters.map((sweeter, index) => (
                        <div
                            key={index}
                            className="flex gap-8 items-center py-2"
                        >
                            <img
                                src={sweeter.image}
                                className="w-[40px] rounded-full"
                            />
                            <p className="text-pure_soul text-sm">
                                {sweeter.name}
                            </p>
                            <span
                                className="w-[8px] h-[8px] rounded-full ml-auto"
                                style={{
                                    backgroundColor:
                                        index % 2 === 1
                                            ? "var(--clr-essence--01)"
                                            : "var(--clr-essence--02)",
                                }}
                            ></span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <img src="/assets/design-element-01.png" />
            </div>
        </section>
    );
};

export default RightSidebar;
