import { useContext, useEffect, useState } from "react";
import { getNotifications, deleteNotification } from "./Api";
import { getDate } from "./Utils/Date";
import { AuthContext } from "./Auth";
import { NotifyContext } from "./View";
import { BsXCircleFill } from "react-icons/bs";

function NotifyTile({ notification, onDelete }) {
  console.log(notification);
  return (
    <div className=" bg-gray-300 rounded-2xl w-min ">
      <div className="flex">
        <h1 className="text-left p-3 text-xl w-10/12">
          From {notification.username}
        </h1>
        <button>
          <BsXCircleFill
            size={25}
            className="ml-6 del-color bg"
            onClick={onDelete}
          />
        </button>
      </div>
      <div className="tile-content p-3 text-xl bg-transparent w-96 resize-none">
        {notification.content}
      </div>
      <h3 className="text-right p-3 text-xl w-100 mr-1">
        {getDate(notification.creation_date)}
      </h3>
    </div>
  );
}

function NoNotify() {
  return (
    <div className="text-left mt-10 text-5xl">
      <h1>You don't have any</h1>
      <h1>new notifications</h1>
    </div>
  );
}

export default function NotifyView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authRequest } = useContext(AuthContext);
  const { loadCount } = useContext(NotifyContext);

  const loadNotifications = async () => {
    try {
      const notifys = await authRequest(getNotifications);
      setNotifications(notifys);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      await loadNotifications();
      await loadCount();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className=" ml-8 text-4xl flex flex-wrap gap-5">
      {!loading ? (
        notifications.length > 0 ? (
          notifications.map((notify) => (
            <NotifyTile
              notification={notify}
              onDelete={() => removeNotification(notify.id)}
            />
          ))
        ) : (
          <NoNotify />
        )
      ) : null}
    </div>
  );
}
