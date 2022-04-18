
# hex_string should be the version of hex spit out by http://string-functions.com/string-hex.aspx
    # SHOULD NOT already have the 0x in front (if using google for numbers, don't copy that part)
# isNumber is a boolean denoting if the hex is a number or not - THIS SHOULD ALREADY BE IN HEX, not in base 10
    # is only used to decide of the long list of 0s should be prepended or appended
def completeHex(hex_string,isNumber=False):
    hex_string = "0x"+hex_string
    if not isNumber:
        while len(hex_string) < 66:
            hex_string += "0"
        return hex_string
    else:
        listed = list(hex_string)
        while len(listed) < 66:
            listed.insert(2,"0")
        return "".join(listed)


# student_id must be str type, already completed hex (with 0x in front)
# blocktime should just be an int type - untransformed from block.timestamp
def generate_key (student_id, blocktime):
    new_blocktime = str(hex(blocktime))[2::]
    print("line 23",new_blocktime)
    new_blocktime = completeHex(new_blocktime,True)
    new_blocktime = new_blocktime[2::]
    # print("new_blocktime",new_blocktime)
    student_id = student_id[2::]
    # print("student_id",student_id)

    output_str = ""

    for i in range(len(student_id)):
        # print(i,student_id[i],new_blocktime[i])
        if student_id[i]!="0" and new_blocktime[i]!="0":
            raise KeyError
        if student_id[i]!="0":
            curr_val = student_id[i]
        elif new_blocktime[i]!="0":
            curr_val = new_blocktime[i]
        else:
            curr_val = "0"
        output_str += curr_val

    return "0x"+output_str