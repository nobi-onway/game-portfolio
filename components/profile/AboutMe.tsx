function AboutMe() {
  return (
    <section className="mx-auto lg:w-[766px]" id="about-me">
      <div className="grid grid-cols-5 items-center justify-center">
        <div className="col-span-2 h-60 border"></div>
        <div className="col-span-3 flex w-full flex-col justify-center">
          <span className="text-center text-xs tracking-widest uppercase opacity-60">
            Fresher Game Developer
          </span>
          <span className="text-center text-lg font-bold tracking-wider uppercase">
            My name is <b className="underline">Doan Gia Bao</b>,
          </span>
          <span className="text-center text-lg font-bold tracking-wider uppercase">
            also is <b className="underline">nobi,</b>
          </span>
          <span className="text-center text-lg font-bold tracking-wider uppercase">
            impassioned game developer.
          </span>
        </div>
      </div>
      <div className="grid grid-cols-5 items-center justify-center">
        <div className="col-span-3">
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-xs tracking-widest uppercase opacity-30">
              First sign of me
            </span>
            <span className="text-xs tracking-wide opacity-80">
              A{' '}
              <b className="font-black opacity-100">Fresher Unity Developer</b>{' '}
              with a passion for game development and graphics technology. I
              have a solid foundation in{' '}
              <b className="font-black opacity-100">Unity, C#,</b> and have
              worked on{' '}
              <b className="font-black opacity-100">
                personal projects specialized in gameplay, and systems.
              </b>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-xs tracking-widest uppercase opacity-30">
              What I have
            </span>
            <ul className="grid list-disc grid-cols-2 gap-4">
              <li className="text-[11px] tracking-wider">
                <b className="font-black underline">Unity</b>: Have experimented
                with Prefabs, Components, Event System, Scriptable Objects.
              </li>
              <li className="text-[11px] tracking-wider">
                <b className="font-black underline">C# scripting</b>: Basic
                understanding of OOP, SOLID principles.
              </li>
              <li className="text-[11px] tracking-wider">
                <b className="font-black underline">AI mechanic</b>: Able to
                implement NavMesh, BehaviorTree, A* PathFinding.
              </li>
              <li className="text-[11px] tracking-wider">
                <b className="font-black underline">Optimization</b>: Learning
                to use Object Pooling.
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-2 h-60 border"></div>
      </div>
    </section>
  );
}

export default AboutMe;
