import React, {useState, useRef, useEffect} from "react";

export default function Dropdown({ placeholder, options = [], value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 바깥 클릭/ESC 닫기
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const hasValue = value != null && value !== "";

  return (
    <div ref={ref} className="relative w-full pb-[0.5rem]">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen(v => !v)}
        className={`text- w-full h-[2.5rem] rounded-[0.5rem] border border-[#DEE2E6] bg-[#FFFFFF] justify-center ${disabled ? "cursor-not-allowed" : ""} ${hasValue ? "text-[#3B3D40]" : "text-[#DEE2E6]"}`}
      >

        <span className="inline-flex items-center gap-[1.5rem]">
            {hasValue ? value : placeholder}  
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path d="M6.89909 0.380978C6.83175 0.264073 6.73453 0.167182 6.61739 0.100241C6.50026 0.0332994 6.36743 -0.00128269 6.23252 4.05312e-05H0.766898C0.631992 -0.00128269 0.499162 0.0332994 0.382028 0.100241C0.264895 0.167182 0.167674 0.264073 0.100335 0.380978C0.0346277 0.493442 0 0.621352 0 0.751603C0 0.881855 0.0346277 1.00976 0.100335 1.12223L2.83252 5.86817C2.90081 5.98444 2.9983 6.08085 3.11533 6.14783C3.23236 6.21482 3.36487 6.25006 3.49971 6.25006C3.63455 6.25006 3.76706 6.21482 3.88409 6.14783C4.00112 6.08085 4.09861 5.98444 4.1669 5.86817L6.89971 1.12223C6.96532 1.00971 6.99984 0.88177 6.99973 0.751518C6.99962 0.621267 6.96489 0.493386 6.89909 0.380978Z" fill="#DEE2E6"/>
            </svg>
        </span>
    
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 w-full max-h-[13rem] rounded-[0.5rem] overflow-auto border-none bg-white shadow-lg pl-[0.25rem] pr-[0.25rem] pt-[0.5rem] pb-[0.5rem]"
        >

          {options.map(opt => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt}
                onClick={() => { onChange?.(opt); setOpen(false); }}
                className={`w-full rounded-[0.25rem] h-[3rem] border-none text-[#B5BBC1] ${
                  value === opt ? "bg-[#FFEEEA]" : "bg-[#FFFFFF]"
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
