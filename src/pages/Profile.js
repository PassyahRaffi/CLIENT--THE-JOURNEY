import React, { useState, useEffect, useContext } from "react";
import { API } from "../config/api";
import { Link } from "react-router-dom";
import dateFormat, { masks } from "dateformat";
import { UserContext } from "../context/userContext";
import parse from "html-react-parser";
{/* photo profile dummy */}
// import ProfileImage from "../assets/profile.jpg";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [post, setPost] = useState([]);
  const [user, setUser] = useState([]);
  const [state, dispatch] = useContext(UserContext);
  // create useState form setForm
  const [form, setForm] = useState({
    image: "",
  });

  // create variabel image form
  const { image } = form;

  // create handle image change
  const handleImageChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // create condition image url priview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
    console.log(form);
  };

  // create function handle image submit
  const handleImageSubmit = async (e) => {
    try {
      // create method DOM prevent default js
      e.preventDefault();

      // Configuration upload file image
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // create form data image
      const formData = new FormData();
      formData.set("image", form.image[0], form.image[0].name);

      // create varriabel response
      const response = await API.patch(
        `/user/edit/image/${state.user.id}`,
        formData,
        config
      );
      console.log(response)
      // create method window reloads dokumen js
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getPostUser = async () => {
    try {
      const response = await API.get(`/postUser/${state.user.id}`);
      setPost(response.data.data.posts);
      setUser(response.data.data.posts.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostUser([]);
  }, []);

  return (
    <main id="profile" className="px-4 md:px-12 py-16">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      {/* create styling form for handleImageSubmit */}
      <form
        className="text-center flex justify-center pt-20"
        // insert function handle image submit
        onSubmit={handleImageSubmit}
      >
        <label
          htmlFor="image"
          className="rounded-full flex items-center"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          // insert title
          title="Change Picture"
        >
          <input
            type="file"
            id="image"
            name="image"
            className="sr-only"
            // insert function handle image change
            onChange={handleImageChange}
          />
          <img
            // insert condition preview user
            src={preview ? preview : state.user.image}
            alt="user"
            className="rounded-full border-2 mb-2 w-40 hover:brightness-75 cursor-pointer"
          />
          {/* insert condition preview user */}
          {preview && (
            <button className="bg-green-600 text-white text-sm px-5 py-1 rounded-full mx-3">
              Save
            </button>
          )}
        </label>
      </form>

      {/* create styling button edit profile */}
      <div className="flex justify-center pt-5 pb-2">
        {/* insert link to page edit profile */}
        <Link to="/editProfile">
          <span
            className="flex object-right-top bg-gray-400 text-white rounded-lg py-1 px-2 hover:bg-gray-200 active:bg-gray-400 focus:outline-none focus:ring-gray-300"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            // insert title
            title="Edit Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 30 30"
            >
              {" "}
              <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
            </svg>
            {/* insert text p */}
            <p className="text-sm">Edit Profile</p>
          </span>
        </Link>
      </div>

      {/* photo profile dummy */}
      {/* <div className="flex items-center justify-center md:mt-16">
        <img src={ProfileImage} alt="" className="w-44 h-44 rounded-full" />
      </div> */}

      <div className="flex items-center justify-center flex-col">
        <h1 className="flex text-xl">{state.user.name}</h1>
        <p>{state.user.email}</p>
        <p>{state.user.phone}</p>
      </div>

      <div className="mt-20 p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {post.map((items, index) => (
          <Link key={index} to={`/detail/${items.id}`}>
            <div className="relative rounded overflow-hidden shadow-lg h-full">
              <div>
                <div>
                  <img
                    src={items.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-6 pt-4">
                  <h3 className="text-xl mb-1 font-bold line-clamp-1">
                    {items.title}
                  </h3>
                </div>
                <div className="px-6">
                  <p className="text-gray-500 line-clamp-1">
                    {dateFormat(items.createdAt, "mediumDate")},{" "}
                    {items.user.name}
                  </p>
                </div>
                <div className="px-6 md:my-6">
                  <p className="line-clamp-3">{parse(items.description)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Profile;
