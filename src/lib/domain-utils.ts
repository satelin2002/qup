import dns from "dns";
import { promisify } from "util";
import axios from "axios";

// Promisify the dns.resolveTxt method for async/await usage
const resolveTxt = promisify(dns.resolveTxt);

/**
 * Validates the syntax of a domain name.
 * @param domain - The domain name to validate.
 * @returns True if the domain name is valid; otherwise, false.
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
  return domainRegex.test(domain);
}

/**
 * Checks the availability of a domain using the Domainr API.
 * @param domain - The domain name to check.
 * @returns True if the domain is available; otherwise, false.
 */
export async function checkDomainAvailability(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.DOMAINR_API_KEY;
  if (!apiKey) {
    throw new Error("Domainr API key is not configured.");
  }

  const response = await axios.get("https://api.domainr.com/v2/status", {
    params: {
      domain,
      client_id: apiKey,
    },
  });

  const status = response.data.status[0].status;
  return status === "undelegated" || status === "inactive";
}

/**
 * Checks if a domain has a specific TXT record containing a verification token.
 * This function is used to verify domain ownership by checking for a specific
 * TXT record in the domain's DNS settings.
 *
 * @param domain - The domain name to check
 * @param token - The verification token to look for in TXT records
 * @returns true if the token is found, false otherwise
 */
export async function checkDnsTxtRecord(
  domain: string,
  token: string
): Promise<boolean> {
  try {
    const records = await resolveTxt(domain);

    // Flatten array and check if any record includes the verification token
    const flattenedRecords = records.flat();
    const isVerified = flattenedRecords.some((record) =>
      record.includes(token)
    );

    if (isVerified) {
      console.log(`TXT record verified for domain: ${domain}`);
    } else {
      console.log(`TXT record not found for domain: ${domain}`);
    }

    return isVerified;
  } catch (error) {
    console.error(`Error verifying TXT record for domain ${domain}:`, error);
    return false;
  }
}
