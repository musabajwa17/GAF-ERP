import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
<nav class="border-gray-200 bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
  <div class=" flex flex-wrap items-center justify-end p-4">
    <div class="w-auto flex items-center" id="navbar-default">
      <ul class="font-medium mt-4 space-x-8 rtl:space-x-reverse mt-0 border-0 bg-white dark:border-gray-700">
        <li>
          <Link href="/" class="block py-2 px-3 text-black rounded-sm">Sign Out</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>

  );
}
export default Header;