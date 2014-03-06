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

    print("starting")
    #process("mini.csv")
    process("geoloc_loc.csv")

    print("done")
    #print(partToNumber("ffff"))
    #print(ipToNumber("::ffff:1.0.64.0"))

    
def process(arg):
    iso = dict()
    
    with open("mappings.csv", 'r') as f:
        for line in f:
            v = line.split(",");
            iso[v[0]] = v[1].strip()

        
    with open(arg, 'r') as f:
        i = 0
        with open("out_" + arg, 'w') as outfile:       
            for line in f:
                if i == 0:
                    outline = line
                else:
                    s = line.split(",")
                    #print s[3]
                    
                    try:
                        s[3] = iso[s[3]]
                    except KeyError:
                        pass
                    outline = ",".join(s)
                    
                outfile.write(outline)
                i += 1
            

if __name__ == "__main__":
    main()
