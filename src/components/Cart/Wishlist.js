import {React, useState, useEffect, useContext} from "react";
import Grid from "@material-ui/core/Grid";
import axios from "../../axios";
import {UserContext} from "../../Context/userContext";
import {Link} from "react-router-dom";

const style = {
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: "10px",
  margin: "10px",
  textAlign: "center",
};
const Wishlist = () => {
  const [user, setUser] = useContext(UserContext);
  const [wishlist, setwishlist] = useState([]);
  // loader states
  const [loader, setloader] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const url = "/getWishlist";
      axios
        .get(url)
        .then((response) => {
          // console.log(response.data.length);
          setwishlist(response.data);
          console.log(response.data.length);
          console.log(response.data);
          setloader(false);
        })
        .catch(() => {
          setwishlist([]);
          setloader(false);
        });
    };
    fetchData();
  }, []);

  // handeling wish list
  const handelWishList = (e) => {
    if (user) {
      e.target.innerHTML = "Removing...";
      e.target.style.color = "red";
      axios
        .delete("/deleteWishlistItem", {
          data: {bookId: e.target.id},
        })
        .then((response) => {
          // console.log(response.data);
          setwishlist(wishlist.filter((item) => e.target.id !== item.bookId));
          localStorage.setItem(
            "bookshlf_user",
            JSON.stringify({
              authHeader: user.authHeader,
              roles: user.roles,
              email: user.email,
              cartitems: user.cartitems,
              wishlist: user.wishlist - 1,
            })
          );
          setUser({
            authHeader: user.authHeader,
            roles: user.roles,
            email: user.email,
            cartitems: user.cartitems,
            wishlist: user.wishlist - 1,
          });
        })
        .catch((err) => {
          // console.log(err.response.data);
        });
    } else {
    }
  };

  return (
    <div
      style={{
        height: "calc(100vh - 90px)",
        width: "100%",
      }}
    >
      {user === null ? (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <i
              className="far fa-frown"
              style={{
                fontSize: "20em",
                color: "rgba(255,0,0,0.4)",
              }}
            />
            <br />
            <h1
              style={{
                fontSize: "3",
                color: "rgba(255,0,0,0.4)",
              }}
            >
              Please Login to See Your Wishlist!
            </h1>
          </div>
        </div>
      ) : (
        <>
          {/* Loader */}
          <div
            className="page-loader"
            style={{display: loader ? "flex" : "none"}}
          >
            <div
              className="page-loading"
              style={{display: loader ? "block" : "none"}}
            ></div>
          </div>
          <div style={{display: loader ? "none" : "block"}}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {wishlist.length > 0 ? (
                <>
                  {wishlist.map((item) => (
                    <Grid style={style} item lg={4} md={6} sm={12} xs={12}>
                      <div className="search-book">
                        <div className="search-book-pic">
                          <img
                            src={item.photo ? item.photo : ""}
                            alt=""
                            height="100%"
                            width="100%"
                            className="bs-image"
                          />
                        </div>
                        <div className="search-book-details">
                          <p className="details-para1">{item.title}</p>
                          <p className="details-para3">{item.author}</p>
                          <p className="details-para4">
                            <i className="fas fa-rupee-sign" />
                            &nbsp;{item.price} /-
                          </p>
                          <div className="hidden-items">
                            <p className="cart" title="Add item to cart">
                              Add To Cart
                            </p>
                            <span
                              title="Add to Wishlist"
                              id={item.bookId}
                              onClick={(e) => {
                                handelWishList(e);
                              }}
                              className="wishlist-remove"
                            >
                              Remove
                            </span>
                          </div>
                          <div
                            title="View Book Details"
                            className="book-more-details"
                          >
                            <Link to={`/BookDetails/${item.bookId}`}>
                              More Details&nbsp;
                              <i className="fas fa-angle-double-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  ))}
                </>
              ) : (
                <Grid style={style} item lg={12} md={12} sm={12} xs={12}>
                  Your Wishlist is Empty!
                </Grid>
              )}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};
export default Wishlist;