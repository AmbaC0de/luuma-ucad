import React, { useState, useMemo } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { SheetProps, FlatList, SheetManager } from "react-native-actions-sheet";
import BottomActionSheet from "./BottomActionSheet";
import { SelectionItem } from "./types";
import { RectButton } from "react-native-gesture-handler";
import Text from "../ui/Text";
import { useTheme } from "@react-navigation/native";

const SelectionSheet = (props: SheetProps<"selection-sheet">) => {
  const { colors } = useTheme();
  const { payload } = props;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!payload?.items) return [];
    if (!searchQuery) return payload.items;
    return payload.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [payload?.items, searchQuery]);

  const handleSelect = (item: SelectionItem) => {
    payload?.onSelect(item);
    SheetManager.hide(props.sheetId);
  };

  if (!payload) return null;

  return (
    <BottomActionSheet id={props.sheetId}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {payload.title}
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Rechercher..."
          placeholderTextColor={colors.text + "80"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <RectButton
            style={[styles.item, { borderBottomColor: colors.border }]}
            onPress={() => handleSelect(item)}
          >
            <Text style={[styles.itemText, { color: colors.text }]}>
              {item.label}
            </Text>
          </RectButton>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.text + "80" }}>
              Aucun résultat trouvé
            </Text>
          </View>
        }
      />
    </BottomActionSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default SelectionSheet;
