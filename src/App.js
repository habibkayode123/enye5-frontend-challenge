import { useEffect, useState } from "react";
import { Input, Button, Card, Row, Col, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./App.css";
import enye from "./asset/img/enye.png";
import "antd/dist/antd.css";
import moment from "moment";

const { Option } = Select;
let numberPerpage = 20;

function App() {
  const [fetchData, setFetchData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [genderValue, setGenderValue] = useState("all");
  const [paymentValue, setPaymentValue] = useState("all");
  const [fullNames, setFullNames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchOn, setSearchOn] = useState(false);
  const [searchPer, setSearchPer] = useState();
  const [retainFilter, setRetainFilter] = useState();
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      let data = await fetch("https://api.enye.tech/v1/challenge/records");
      let result = await data.json();
      setFetchData(result.records.profiles);
      setFilterData((prev) => result.records.profiles);
      let names = result.records.profiles.map((item) =>
        `${item.FirstName} ${item.LastName}`.toLowerCase()
      );
      setFullNames(names);
      setLoading(false);
    } catch (e) {
      //error h
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setNumberOfPage((prev) => filterData.length);
    let tracker = currentIndex * numberPerpage;
    let part = filterData.slice(tracker - numberPerpage, tracker);
    setDisplayData(part);
    window.scrollTo(0, 0);
  }, [currentIndex, filterData]);

  const searchName = () => {
    let searchResult = [];
    setSearchPer(searchInput);
    setSearchOn(true);
    fullNames.forEach((ele, index) => {
      if (ele.includes(searchInput)) {
        searchResult.push(fetchData[index]);
      }
    });
    setFilterData(searchResult);
    setRetainFilter(searchResult);
  };

  const genderChange = (value) => {
    setGenderValue((prev) => value);
    let searchAbleData = fetchData;
    if (searchOn) {
      searchAbleData = retainFilter;
    }
    if (value !== "all") {
      let newData = searchAbleData.filter((item) => item.Gender === value);
      if (paymentValue !== "all") {
        newData = newData.filter((item) => item.PaymentMethod === paymentValue);
      }
      setFilterData((prev) => newData);
      setNumberOfPage(newData.length);
    } else if (value === "all") {
      let allData = searchAbleData;
      if (paymentValue !== "all") {
        allData = allData.filter((item) => item.PaymentMethod === paymentValue);
      }
      setFilterData(allData);
    }
  };

  const PaymentMethodChange = (value) => {
    setPaymentValue((prev) => value);
    let searchAbleData = fetchData;
    if (searchOn) {
      searchAbleData = retainFilter;
    }
    if (value !== "all") {
      let newData = searchAbleData.filter(
        (item) => item.PaymentMethod === value
      );
      if (genderValue !== "all") {
        newData = newData.filter((item) => item.Gender === genderValue);
      }
      setNumberOfPage(newData.length);
      setFilterData((prev) => newData);
      return;
    } else if (value === "all") {
      let allData = searchAbleData;
      if (genderValue !== "all") {
        allData = allData.filter((item) => item.Gender === genderValue);
      }
      setFilterData(allData);
    }
  };
  return (
    <div className="App">
      <div className="header">
        <div>
          <img src={enye} alt="Enye Logo" className="logo" />
        </div>
        <div className="header-div">
          <p>Transaction History</p>
        </div>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="body">
          <div className="search-container">
            <Input
              onChange={(ele) => setSearchInput(ele.target.value.toLowerCase())}
              value={searchInput}
              bordered={false}
              placeholder="Starting typing to search for a particular patients"
              prefix={<SearchOutlined size="24" color="#40A9FF" />}
              className="search-input"
              style={{
                width: "100%",
                height: "100%",
                fontSize: 20,
                padding: 8,
              }}
            />
            <div className="search-button-div">
              <Button
                className="search-button"
                style={{
                  height: "100%",
                  fontSize: 24,
                  border: 0,
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
                disabled={searchInput.length > 2 ? false : true}
                onClick={() => {
                  searchName();
                }}
              >
                Search
              </Button>
            </div>
          </div>
          {searchOn && (
            <div
              style={{
                marginTop: 32,
                width: "60%",
                marginLeft: "auto",
                marginRight: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 24,
                }}
              >
                Showing result for{" "}
                <span style={{ fontWeight: "600", color: "#5E60E7" }}>
                  {searchPer}
                </span>
              </p>
              <Button
                style={{
                  backgroundColor: "rgb(94, 96, 231)",
                  color: "white",
                  fontWeight: 600,
                }}
                onClick={() => {
                  setSearchInput("");
                  setSearchOn(false);
                  setFilterData(fetchData);
                }}
              >
                Show All Profiles
              </Button>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 32,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 16 }}>Filter By</span>
            <div className="filter-div">
              <span style={{ color: "gray", paddingLeft: 4 }}>Gender:</span>
              <Select
                bordered={false}
                defaultValue="all"
                style={{ width: "auto", fontWeight: 600 }}
                onChange={genderChange}
                dropdownMatchSelectWidth={120}
              >
                <Option value="Male">Only Male</Option>
                <Option value="Female">Only Female</Option>
                <Option value="all">All</Option>
              </Select>
            </div>

            <div className="filter-div">
              <span style={{ color: "gray", paddingLeft: 4 }}>
                Payment Method:{" "}
              </span>
              <Select
                bordered={false}
                defaultValue="all"
                style={{ width: "auto", fontWeight: 600 }}
                onChange={PaymentMethodChange}
                dropdownMatchSelectWidth={120}
              >
                <Option value="cc">cc</Option>
                <Option value="money order">Money Order</Option>
                <Option value="check">Check</Option>
                <Option value="paypal">Paypal</Option>
                <Option value="all">All</Option>
              </Select>
            </div>
          </div>

          <div className="result-container">
            {displayData.map((item) => {
              return (
                <Card
                  title={
                    <p
                      style={{
                        marginBottom: 0,
                        color: "rgb(77, 29, 104)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: 12, marginRight: 8 }}>
                          from
                        </span>
                        <a href={item.URL}>{item.URL}</a>
                      </span>
                      <span style={{ fontSize: 12 }}>
                        last seen on
                        <span style={{ color: "#38cb89", marginLeft: 4 }}>
                          {moment(item.LastLogin).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </span>
                      </span>
                    </p>
                  }
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 24,
                  }}
                >
                  <Row>
                    <Col span={8}>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">Name</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{`${item.FirstName} ${item.LastName}`}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">UserName</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.UserName}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">Gender</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.Gender}</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">Email</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.Email}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">Phone Number</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.PhoneNumber}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">MacAddress</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.MacAddress}</p>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={8}>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">Payment Method</p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.PaymentMethod}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">
                            Credit Card Type
                          </p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">{item.CreditCardType}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p className="margin-0 align-right">
                            Credit Card Number
                          </p>
                        </Col>
                        <Col span={12}>
                          <p className="margin-0 bold">
                            {item.CreditCardNumber}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              );
            })}

            {numberOfPage > 0 && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  defaultCurrent={1}
                  total={numberOfPage}
                  defaultPageSize={20}
                  showSizeChanger={false}
                  onChange={(page, pageSize) => {
                    setCurrentIndex(page);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
