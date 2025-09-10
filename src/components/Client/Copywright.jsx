export default function Copywright() {
  return (
    <div className="text-center fixed bottom-0 bg-white w-full text-xs p-1 border text-gray-600">
      <p>
        © {new Date().getFullYear()}{" "}
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Ezaazi Technologies
        </a>{" "}
        — All rights reserved.
      </p>
      <p>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=shavez@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Email Us
        </a>
      </p>
    </div>
  );
}
