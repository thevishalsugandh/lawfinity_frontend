// components/UserProfileCard.js

import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const UserProfileCard = () => {
  const { user } = useUser();

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-lg">
      <div className="px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="relative h-24 w-24">
            <Image
              src={user.picture}
              alt="Profile Picture"
              className="rounded-full"
              width={250}
              height={250}
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/api/auth/logout"
            className="side-menu-item bg-tertiary hover:bg-quaternary items-center justify-center"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
