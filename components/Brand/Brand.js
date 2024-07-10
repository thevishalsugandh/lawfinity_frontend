import Image from "next/image";

export const Brand = () => {
  return (
    <div className="flex items-center justify-center">
      <span className="whitespace-nowrap ">
        <Image
          src={"/favicon2.png"}
          alt="logo image"
          width={50}
          height={50}
          priority="true"
        />
      </span>
      <h1 className="text-primary mx-2 p-2 text-2xl">Lawfinity</h1>
    </div>
  );
};
