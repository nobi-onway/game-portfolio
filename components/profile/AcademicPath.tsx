import Image from 'next/image';

function AcademicPath() {
  return (
    <section id="academic-path" className="mx-auto h-96 lg:w-[766px]">
      <div className="relative mx-auto aspect-square h-full">
        <Image
          className="opacity-20"
          alt="graduation-hat"
          src="https://img.pikbest.com/png-images/20240815/3d-graduation-cap_10727497.png!sw800"
          fill
        />
        <div className="absolute top-0 right-0 bottom-0 left-0 flex h-full flex-col items-center justify-center gap-4">
          <span className="text-4xl font-bold text-[#f05123]">
            FPT University
          </span>
          <span className="text-center italic">
            2020 decided to be a student of FPT University, is one of the
            leading universities in Vietnam for training in the field of
            Information Technology
          </span>
        </div>
      </div>
    </section>
  );
}

export default AcademicPath;
