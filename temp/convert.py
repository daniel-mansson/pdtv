import sys
import getopt

def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "h", ["help"])
    except getopt.error, msg:
        print msg
        print "for help use --help"
        sys.exit(2)
        
    for arg in args:
        process(arg)

    print("asdfasdf")
    #process("mini.csv")
    process("GeoLite2-City-Blocks.csv")

    #print(partToNumber("ffff"))
    #print(ipToNumber("::ffff:1.0.64.0"))

    
def process(arg):
    with open(arg, 'r') as f:
        with open("out_" + arg, 'w') as outfile:
            i = 0
            c = 0
            prevc = -1
         
            for line in f:
                if i == 0:
                    s = line.split(",")
                    s[1] = "network_end_ip"
                    outline = ",".join(s)
                else:
                    s = line.split(",")
                    num = ipToNumber(s[0]);
                    s[0] = str(num)
                    s[1] = str(num + (128 - int(s[1])) - 1)
                    
                    outline = ",".join(s)
                i += 1
                outfile.write(outline)
                c += 1
                nextc = (1000 * c) / 2783245
                if nextc != prevc:
                    print(str(nextc / 10.0) + "%")
                    prevc = nextc

def ipToNumber(ip):
    p = ip.split(":");
    
    if "." in ip:
        shift = 24
        result = 0
        for v in map(lambda x: int(x), p[-1].split(".")):
            result += v << shift
            shift -= 8
        result += 0xffff00000000
        return result
    else:
        shift = 48
        result = 0
        for i in range(min(4, len(p))):
            result += partToNumber(p[i]) << shift
            shift -= 16
        return result

def partToNumber(p):
    if len(p) > 0:
        return int(p, 16)
    else:
        return 0
        
        
if __name__ == "__main__":
    main()
