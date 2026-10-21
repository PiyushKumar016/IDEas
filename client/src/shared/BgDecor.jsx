import logo from "../assets/image2.png";

const DECORS = [
  {
    style: {
      width: 600,
      top: "5%",
      left: "-10%",
      opacity: 0.05,
      transform: "rotate(-65deg)",
    },
  },
  {
    style: {
      width: 550,
      top: "35%",
      right: "-15%",
      opacity: 0.05,
      transform: "rotate(-160deg)",
    },
  },
  {
    style: {
      width: 700,
      bottom: "8%",
      left: "30%",
      opacity: 0.05,
      transform: "rotate(58deg)",
    },
  },
];

export default function BgDecor() {
  return (
    <>
      {DECORS.map((d, i) => (
        <img
          key={i}
          src={logo}
          alt=""
          aria-hidden="true"
          className="fixed pointer-events-none select-none"
          style={{
            ...d.style,
            mixBlendMode: "multiply",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}