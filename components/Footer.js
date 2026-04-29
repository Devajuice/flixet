"use client";
import Link from "next/link";
import {
  AlertTriangle,
  Film,
  Tv,
  FileText,
  Shield,
  Mail,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 80,
        paddingTop: 64,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 var(--container-padding)",
        }}
      >
        {/* Disclaimer */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--gold)",
            borderRadius: "var(--radius-xl)",
            padding: "22px 24px",
            marginBottom: 52,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 12,
            }}
          >
            <AlertTriangle size={15} color="var(--gold)" />
            <h4
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-bold)",
                color: "var(--gold)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: 0,
              }}
            >
              Important Disclaimer
            </h4>
          </div>
          <p
            style={{
              fontSize: "var(--text-sm)",
              lineHeight: 1.7,
              color: "var(--text-tertiary)",
              margin: 0,
            }}
          >
            Flixet does not host, store, or distribute any video content. All
            videos are embedded from third-party sources. We do not claim
            ownership of any content displayed on this website. All trademarks,
            logos, and brand names are the property of their respective owners.
            If you believe any content infringes on your copyright, please
            contact us for removal.
          </p>
        </div>

        {/* Content grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 44,
            marginBottom: 44,
          }}
        >
          {/* About */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <Film size={16} color="var(--gold)" />
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-bold)",
                  margin: 0,
                }}
              >
                About Flixet
              </h3>
            </div>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Flixet is a free streaming aggregator that provides links to
              movies and TV shows from various third-party sources. We do not
              upload or host any files on our servers.
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "12px 14px",
                marginTop: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-tertiary)",
                }}
              >
                <Mail size={13} color="var(--gold)" />
                <a
                  href="mailto:devajuice@zohomail.in"
                  style={{
                    color: "var(--gold)",
                    textDecoration: "none",
                    fontWeight: "var(--font-semibold)",
                  }}
                >
                  devajuice@zohomail.in
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <Tv size={16} color="var(--gold)" />
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-bold)",
                  margin: 0,
                }}
              >
                Quick Links
              </h3>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {[
                { href: "/", icon: Film, label: "Home" },
                { href: "/movies", icon: Film, label: "Movies" },
                { href: "/tv", icon: Tv, label: "TV Shows" },
                {
                  href: "/coming-soon/movies",
                  icon: Film,
                  label: "Upcoming Movies",
                },
                { href: "/coming-soon/tv", icon: Tv, label: "On The Air" },
              ].map((link) => (
                <li key={link.href} style={{ position: "relative" }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 0 7px 16px",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-medium)",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    <link.icon size={13} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <Shield size={16} color="var(--gold)" />
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-bold)",
                  margin: 0,
                }}
              >
                Legal
              </h3>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {[
                { href: "/terms", icon: FileText, label: "Terms of Service" },
                { href: "/privacy", icon: Shield, label: "Privacy Policy" },
                { href: "/dmca", icon: AlertTriangle, label: "DMCA" },
              ].map((link) => (
                <li key={link.href} style={{ position: "relative" }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 0 7px 16px",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-medium)",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    <link.icon size={13} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p
              style={{
                marginTop: 18,
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
              }}
            >
              By using this website, you agree to our Terms of Service. Users
              are responsible for complying with their local laws regarding
              online streaming.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{ height: 1, background: "var(--border)", margin: "0 0 36px" }}
        />

        {/* Bottom */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: 44,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            © {currentYear} Flixet. All rights reserved.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
            }}
          >
            Made with <Heart size={13} color="var(--accent)" /> by Flixet Team
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                fontWeight: "var(--font-semibold)",
                margin: 0,
              }}
            >
              Powered by
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: "var(--font-bold)",
                fontSize: "var(--text-sm)",
              }}
            >
              The Movie Database (TMDb) <ExternalLink size={12} />
            </a>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                textAlign: "center",
                margin: 0,
              }}
            >
              This product uses the TMDb API but is not endorsed or certified by
              TMDb.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
