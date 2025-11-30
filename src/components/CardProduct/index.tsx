import { Text, View } from "react-native";
import { RequestConfirmed } from "~/pages/Requester/RequesterSimple";
import DropdownMenu from "../Dropdown";

const CardProduct: React.FC<RequestConfirmed & { onDelete: () => void }> = ({
  title,
  code,
  count,
  isSelected,
  qtdDisp,
  ptm,
  os,
  onDelete,
}) => {
  const quantityInStock = qtdDisp;

  return (
    <View
      className="flex flex-col space-y-9 rounded-md p-5"
      style={{ backgroundColor: "#F2F9FF" }}
    >
      <View className="flex flex-row justify-around ">
        <Text
          className="w-44 text-white"
          style={{ color: "#034881", fontSize: 20, fontWeight: "bold" }}
        >
          {
            title
            // title.length <= 15 ?
            //   title :
            //   `${title.substring(0, 15)}...`
          }
        </Text>
        {isSelected ? <DropdownMenu onDelete={onDelete} /> : null}
      </View>

      <View>
        <View className="flex flex-row items-center">
          <Text style={{ fontSize: 14, color: "#034881" }}>Código OTK: </Text>
          <Text
            style={{ fontSize: 14, color: "#7C7C7CCC", fontWeight: "bold" }}
          >
            {code}
          </Text>
        </View>
        {!isSelected ? (
          <View className="flex flex-row items-center space-x-1 pt-3">
            <Text style={{ fontSize: 11, color: "#034881" }}>
              Quantidade Disponível:
            </Text>

            <Text
              style={{ fontSize: 11, color: "#7C7C7CCC", fontWeight: "bold" }}
            >
              {quantityInStock}
            </Text>
          </View>
        ) : null}
        {isSelected ? (
          <View>
            <View className="flex flex-row items-center">
              <Text style={{ fontSize: 14, color: "#034881" }}>
                Quantidade:{" "}
              </Text>
              <Text
                style={{ fontSize: 14, color: "#7C7C7CCC", fontWeight: "bold" }}
              >
                {count}
              </Text>
            </View>
          </View>
        ) : null}
        {isSelected && ptm.length > 0 ? (
          <View>
            <View className="flex flex-row items-center">
              <Text style={{ fontSize: 14, color: "#034881" }}>PTM: </Text>
              <Text
                style={{ fontSize: 14, color: "#7C7C7CCC", fontWeight: "bold" }}
              >
                {ptm}
              </Text>
            </View>
          </View>
        ) : null}
        {isSelected && os.length > 0 ? (
          <View>
            <View className="flex flex-row items-center">
              <Text style={{ fontSize: 14, color: "#034881" }}>OS: </Text>
              <Text
                style={{ fontSize: 14, color: "#7C7C7CCC", fontWeight: "bold" }}
              >
                {os}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CardProduct;
